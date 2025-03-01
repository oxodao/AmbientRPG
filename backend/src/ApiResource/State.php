<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Entity\Campaign;
use App\Entity\Character;
use App\Entity\EffectSet;
use App\Entity\Image;
use App\Entity\SoundEffect;
use App\Entity\Soundtrack;
use App\State\Processor\StateProcessor;
use App\State\Provider\StateProvider;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    uriTemplate: '/state',
    operations: [
        new GetCollection(name: 'get_state'),
        new Post(status: 200),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [
            Campaign::API_GET_ITEM,
            self::API_GET,
            Image::API_GET_ITEM,
            SoundEffect::API_GET_ITEM,
            Character::API_GET_ITEM,
            Soundtrack::API_GET_ITEM,
            EffectSet::API_GET_ITEM,
        ]
    ],
    denormalizationContext: [
        AbstractNormalizer::GROUPS => [
            self::API_SET,
        ]
    ],
    provider: StateProvider::class,
    processor: StateProcessor::class
)]
class State
{
    public const string API_GET = 'api:state:get';
    public const string API_SET = 'api:state:set';

    #[Groups([self::API_GET, self::API_SET])]
    public ?Campaign $campaign = null;

    #[Groups([self::API_GET, self::API_SET])]
    #[Assert\NotBlank]
    #[Assert\PositiveOrZero]
    public int $backgroundDuration = 30;

    /**
     * The iris
     *
     * @var array<string>
     */
    #[Groups([self::API_GET, self::API_SET])]
    public array $displayedImages = [];

    /**
     * The iris
     *
     * @var array<string>
     */
    #[Groups([self::API_GET, self::API_SET])]
    public array $displayedSoundEffects = [];

    #[Groups([self::API_GET, self::API_SET])]
    public ?string $playingSoundtrack = null;
}
