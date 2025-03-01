<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Common\Filter\SearchFilterInterface;
use ApiPlatform\Doctrine\Orm\Filter\ExistsFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\HasCampaignInterface;
use App\Repository\SoundtrackRepository;
use App\State\Provider\SoundtrackProvider;
use App\Utils\StringUtils;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ApiResource(
    operations: [
        new Get(normalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_GET_ITEM],
        ]),
        new Get(
            uriTemplate: '/soundtracks/{id}/download',
            provider: SoundtrackProvider::class,
        ),
        new GetCollection(normalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_GET_COLLECTION],
        ]),
        new Post(
            inputFormats: ['multipart' => ['multipart/form-data']],
            outputFormats: ['jsonld' => ['application/ld+json']],
            normalizationContext: [
                AbstractNormalizer::GROUPS => [self::API_GET_ITEM],
            ],
            denormalizationContext: [
                AbstractNormalizer::GROUPS => [self::API_CREATE],
            ],
        ),
        new Patch(
            normalizationContext: [
                AbstractNormalizer::GROUPS => [self::API_GET_ITEM],
            ],
            denormalizationContext: [
                AbstractNormalizer::GROUPS => [self::API_UPDATE],
            ],
        ),
        new Delete(),
    ],
)]
#[ApiFilter(SearchFilter::class, properties: [
    'searchableName' => SearchFilterInterface::STRATEGY_IPARTIAL,
    'campaign' => SearchFilterInterface::STRATEGY_EXACT,
    'scene' => SearchFilterInterface::STRATEGY_EXACT,
])]
#[ApiFilter(ExistsFilter::class, properties: ['scene'])]
#[ORM\Entity(repositoryClass: SoundtrackRepository::class)]
#[Vich\Uploadable]
class Soundtrack implements HasCampaignInterface
{
    public const string API_GET_ITEM = 'api:soundtrack:get';
    public const string API_GET_COLLECTION = 'api:soundtrack:get-collection';
    public const string API_CREATE = 'api:soundtrack:create';
    public const string API_UPDATE = 'api:soundtrack:update';

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

    #[ORM\ManyToOne(targetEntity: Scene::class, inversedBy: 'soundtracks')]
    #[ORM\JoinColumn(nullable: true)]
    #[Assert\Expression(
        'this.getScene() === null or this.getCampaign() === this.getScene().getCampaign()',
        message: 'The scene does not belong to the campaign!',
    )]
    #[Groups([self::API_CREATE])]
    private ?Scene $scene = null;

    #[ORM\ManyToOne(targetEntity: Campaign::class, inversedBy: 'soundtracks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([self::API_CREATE])]
    private Campaign $campaign;

    #[Vich\UploadableField(mapping: 'soundtracks', fileNameProperty: 'filename')]
    #[Groups([self::API_CREATE])]
    private ?File $file = null;

    #[ORM\Column(type: Types::STRING, nullable: true)]
    private ?string $filename = null;

    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
    ])]
    public string $url;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

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

    public function getScene(): ?Scene
    {
        return $this->scene;
    }

    public function setScene(?Scene $scene): self
    {
        $this->scene = $scene;

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

    public function getFile(): ?File
    {
        return $this->file;
    }

    public function setFile(?File $file): self
    {
        $this->file = $file;

        if (null !== $file) {
            $this->updatedAt = new \DateTimeImmutable();
        }

        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(?string $filename): self
    {
        $this->filename = $filename;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
