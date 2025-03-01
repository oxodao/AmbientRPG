<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\MercureToken;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

readonly class MercureTokenProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire(env: 'MERCURE_SUBSCRIBER_JWT_KEY')]
        private string $mercureSecret,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $output = new MercureToken();

        $config = Configuration::forSymmetricSigner(
            new Sha256(),
            InMemory::base64Encoded(base64_encode($this->mercureSecret)),
        );

        $output->token = $config->builder()
            ->issuedAt(new \DateTimeImmutable())
            ->withClaim('mercure', [
                'subscribe' => ['*'],
                'publish' => [],
            ])
            ->getToken($config->signer(), $config->signingKey())
            ->toString()
        ;

        return $output;
    }
}
