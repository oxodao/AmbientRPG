package utils

import (
	"encoding/json"
	"fmt"
	"strings"
)

type Color struct {
	R int
	G int
	B int
}

func (c Color) ToHex() string {
	return fmt.Sprintf("%02X%02X%02X", c.R, c.G, c.B)
}

func (c Color) ToHashHex() string {
	return fmt.Sprintf("%02X%02X%02X", c.R, c.G, c.B)
}

func (c Color) ToArray() [3]int {
	return [3]int{c.R, c.G, c.B}
}

func (c Color) ToSlice() []int {
	return []int{c.R, c.G, c.B}
}

// Supports "#RRGGBB" or "RRGGBB" or [R, G, B]
func (c *Color) UnmarshalJSON(data []byte) error {
	// Try to unmarshal as array first
	var arr [3]int
	if err := json.Unmarshal(data, &arr); err == nil {
		c.R = arr[0]
		c.G = arr[1]
		c.B = arr[2]
		return nil
	}

	// Try to unmarshal as string
	var str string
	if err := json.Unmarshal(data, &str); err != nil {
		return fmt.Errorf("invalid color format: must be string or array")
	}

	// Remove # if present
	str = strings.TrimPrefix(str, "#")

	// Parse hex string
	if len(str) != 6 {
		return fmt.Errorf("invalid hex color format: expected 6 characters, got %d", len(str))
	}

	_, err := fmt.Sscanf(str, "%02X%02X%02X", &c.R, &c.G, &c.B)
	if err != nil {
		return fmt.Errorf("failed to parse hex color: %w", err)
	}

	return nil
}

func (c *Color) MarshalJSON() ([]byte, error) {
	return json.Marshal(c.ToHashHex())
}
