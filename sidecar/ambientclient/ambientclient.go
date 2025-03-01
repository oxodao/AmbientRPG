package ambientclient

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strings"

	"github.com/oxodao/ambientrpg/config"
	sse "github.com/r3labs/sse/v2"
)

var GET AmbientClient

type AmbientClient struct {
	baseUrl        string
	client         *http.Client
	mercureToken   string
	mercureClient  *sse.Client
	noSslTransport *http.Transport

	State State
}

func (ac *AmbientClient) FetchState() error {
	req, err := http.NewRequest(http.MethodGet, ac.baseUrl+"api/state", nil)
	if err != nil {
		return err
	}

	resp, err := ac.client.Do(req)
	if err != nil {
		return err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	state := State{}
	err = json.Unmarshal(data, &state)
	if err != nil {
		return err
	}

	ac.State = state

	return nil
}

func (ac *AmbientClient) SetState(state State) error {
	body, _ := json.Marshal(state)

	req, err := http.NewRequest(http.MethodPost, ac.baseUrl+"api/state", bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := ac.client.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("unexpected status code from ambientrpg php server: %v", resp.StatusCode)
	}

	respData, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	var newState State
	err = json.Unmarshal(respData, &newState)
	if err != nil {
		return err
	}

	ac.State = newState

	return nil
}

func (ac *AmbientClient) fetchMercureToken() error {
	req, err := http.NewRequest(http.MethodGet, ac.baseUrl+"api/mercure-token", nil)
	if err != nil {
		return err
	}

	resp, err := ac.client.Do(req)
	if err != nil {
		return err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	respData := map[string]string{}
	err = json.Unmarshal(data, &respData)
	if err != nil {
		return err
	}

	ac.mercureToken = respData["token"]

	return nil
}

func (ac *AmbientClient) listenMercure(mercureEffectsHandler func(msg *sse.Event)) error {
	mercureUrl, _ := url.Parse(GET.baseUrl + "/.well-known/mercure")
	cookies, err := cookiejar.New(nil)
	if err != nil {
		return err
	}

	cookies.SetCookies(mercureUrl, []*http.Cookie{
		{Name: "mercureAuthorization", Value: GET.mercureToken, Path: "/"},
	})

	fmt.Println("Listening to mercure...")
	sseClient := sse.NewClient(GET.baseUrl + ".well-known/mercure?topic=/state&topic=/effects")
	sseClient.Connection.Jar = cookies
	sseClient.Connection.Transport = ac.noSslTransport

	ac.mercureClient = sseClient

	go func() {
		sseClient.Subscribe("/state", func(msg *sse.Event) {
			if string(msg.Event) != "/state" {
				return
			}

			var state State
			err := json.Unmarshal(msg.Data, &state)

			if err != nil {
				fmt.Println("Failed to parse mercure State message: ", err)

				return
			}

			ac.State = state
		})
	}()

	go func() {
		sseClient.Subscribe("/effects", func(msg *sse.Event) {
			if string(msg.Event) != "/effects" {
				return
			}

			mercureEffectsHandler(msg)
		})
	}()

	return nil
}

func (ac *AmbientClient) Shutdown() {
	ac.mercureClient.Connection.CloseIdleConnections()
}

func Load(mercureEffectsHandler func(msg *sse.Event)) error {
	GET = AmbientClient{
		baseUrl: config.GET.Server.Url,
		noSslTransport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	GET.client = &http.Client{
		Transport: GET.noSslTransport,
	}

	if !strings.HasSuffix(GET.baseUrl, "/") {
		GET.baseUrl = GET.baseUrl + "/"
	}

	fmt.Println("Fetching current state...")
	if err := GET.FetchState(); err != nil {
		return err
	}

	fmt.Println("Fetching Mercure token...")
	if err := GET.fetchMercureToken(); err != nil {
		return err
	}

	return GET.listenMercure(mercureEffectsHandler)
}
