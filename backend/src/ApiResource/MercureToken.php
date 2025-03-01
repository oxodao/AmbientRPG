<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\State\Provider\MercureTokenProvider;

#[ApiResource(operations: [
    new GetCollection(
        uriTemplate: '/mercure-token',
        provider: MercureTokenProvider::class,
    ),
])]
class MercureToken
{
    public string $token = '';
}
