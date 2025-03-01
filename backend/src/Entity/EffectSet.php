<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Common\Filter\SearchFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\HasCampaignInterface;
use App\Repository\EffectRepository;
use App\Utils\StringUtils;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Temporary
 * The end goal is to have effects properly represented so that the iris are dynamically set from the DB
 * At any modification, it should be recalcuated in EffectSet.effect so that we can push it to
 * the sidecar quickly
 */

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(normalizationContext: [AbstractNormalizer::GROUPS => [self::API_GET_COLLECTION]]),
        new Post(denormalizationContext: [AbstractNormalizer::GROUPS => [self::API_CREATE]]),
        new Patch(
            normalizationContext: [AbstractNormalizer::GROUPS => [self::API_GET_ITEM]],
            denormalizationContext: [AbstractNormalizer::GROUPS => [self::API_UPDATE]],
        ),
        new Delete(),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [self::API_GET_ITEM],
    ]
)]
#[ApiFilter(SearchFilter::class, properties: [
    'searchableName' => SearchFilterInterface::STRATEGY_IPARTIAL,
    'campaign' => SearchFilterInterface::STRATEGY_EXACT,
])]
#[ORM\Entity(repositoryClass: EffectRepository::class)]
#[Vich\Uploadable]
class EffectSet implements HasCampaignInterface
{
    public const string API_GET_ITEM = 'api:fx_set:get';
    public const string API_GET_COLLECTION = 'api:fx_set:get-collection';
    public const string API_CREATE = 'api:fx_set:create';
    public const string API_UPDATE = 'api:fx_set:update';

    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
    ])]
    private int $id;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Assert\NotBlank]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    private string $name = '';

    #[ORM\Column(type: Types::STRING, length: 255)]
    private string $searchableName = '';

    #[ORM\ManyToOne(targetEntity: Campaign::class, inversedBy: 'effectSets')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([self::API_CREATE])]
    private Campaign $campaign;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::API_GET_ITEM, self::API_GET_COLLECTION])]
    private ?string $effect = null;

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
        $this->searchableName = StringUtils::searchableText($name);

        return $this;
    }

    public function getSearchableName(): string
    {
        return $this->searchableName;
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

    public function getEffect(): ?string
    {
        return $this->effect;
    }

    public function setEffect(?string $effect): self
    {
        $this->effect = $effect;

        return $this;
    }
}
