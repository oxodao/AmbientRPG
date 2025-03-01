<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Entity\EffectSet;
use App\State\Processor\TriggerFxProcessor;
use Symfony\Component\Serializer\Attribute\Groups;

#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/trigger-fx',
            denormalizationContext: [self::API_POST],
            processor: TriggerFxProcessor::class,
        )
    ]
)]
class TriggerFx
{
    public const string API_POST = 'api:trigger-fx:post';

    #[Groups([self::API_POST])]
    public EffectSet $effectSet;
}
