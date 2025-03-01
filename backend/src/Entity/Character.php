<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Common\Filter\SearchFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Utils\StringUtils;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(
            // First we sort by "is a player" then by name
            order: ['npc' => 'ASC', 'name' => 'ASC'],
            // order: ['npc' => 'DESC'],
            normalizationContext: [AbstractNormalizer::GROUPS => [self::API_GET_COLLECTION]],
        ),
        new Post(denormalizationContext: [AbstractNormalizer::GROUPS => [self::API_CREATE]]),
        new Patch(denormalizationContext: [AbstractNormalizer::GROUPS => [self::API_UPDATE]]),
        new Delete(),
    ],
    normalizationContext: [AbstractNormalizer::GROUPS => [self::API_GET_ITEM]],
)]
#[ApiFilter(SearchFilter::class, properties: [
    'searchableName' => SearchFilterInterface::STRATEGY_IPARTIAL,
    'campaign' => SearchFilterInterface::STRATEGY_EXACT,
    'scene' => SearchFilterInterface::STRATEGY_EXACT,
])]
#[ApiFilter(ExistsFilter::class, properties: ['scene'])]
#[ApiFilter(BooleanFilter::class, properties: ['npc'])]
class Character
{
    public const string API_GET_ITEM = 'api:character:get';
    public const string API_GET_COLLECTION = 'api:character:get-collection';
    public const string API_CREATE = 'api:character:create';
    public const string API_UPDATE = 'api:character:update';

    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
    ])]
    private int $id;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    #[Assert\NotBlank]
    private string $name = '';

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    #[Assert\NotBlank]
    private string $class = '';

    #[ORM\Column(type: Types::STRING, length: 255)]
    private string $searchableName = '';

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    private string $playedBy = '';

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    private ?string $notes = null;

    #[ORM\ManyToOne(targetEntity: Campaign::class, inversedBy: 'characters')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([self::API_CREATE])]
    private Campaign $campaign;

    #[ORM\ManyToOne(targetEntity: Scene::class, inversedBy: 'characters')]
    #[ORM\JoinColumn(nullable: true)]
    #[Assert\Expression(
        'this.getScene() === null or this.getCampaign() === this.getScene().getCampaign()',
        message: 'The scene does not belong to the campaign!',
    )]
    #[Groups([self::API_CREATE])]
    private ?Scene $scene = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    private bool $npc = true;

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        $this->searchableName = StringUtils::searchableText($name . ' ' . $this->getPlayedBy());

        return $this;
    }

    public function getClass(): string
    {
        return $this->class;
    }

    public function setClass(string $class): self
    {
        $this->class = $class;

        return $this;
    }

    public function getSearchableName(): string
    {
        return $this->searchableName;
    }

    public function getPlayedBy(): string
    {
        return $this->playedBy;
    }

    public function setPlayedBy(string $playedBy): self
    {
        $this->playedBy = $playedBy;
        $this->searchableName = StringUtils::searchableText($this->getName() . ' ' . $playedBy);

        return $this;
    }

    public function getCampaign(): Campaign
    {
        return $this->campaign;
    }

    public function setCampaign(Campaign $campaign): self
    {
        $this->campaign = $campaign;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;

        return $this;
    }

    public function isNpc(): bool
    {
        return $this->npc;
    }

    public function setNpc(bool $npc): self
    {
        $this->npc = $npc;

        return $this;
    }

    public function getScene(): ?Scene
    {
        return $this->scene;
    }

    public function setScene(?Scene $scene): self
    {
        $this->scene = $scene;

        return $this;
    }
}
