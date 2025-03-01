<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Interface\HasCampaignInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(normalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_GET_COLLECTION],
        ]),
        new Post(denormalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_CREATE],
        ]),
        new Patch(denormalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_UPDATE],
        ]),
        new Delete(),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [self::API_GET_ITEM],
    ]
)]
#[ORM\Entity]
class Scene implements HasCampaignInterface
{
    public const string API_GET_ITEM = 'api:scene:get';
    public const string API_GET_COLLECTION = 'api:scene:get-collection';
    public const string API_CREATE = 'api:scene:create';
    public const string API_UPDATE = 'api:scene:update';

    #[ORM\Id]
    #[ORM\Column(type: Types::INTEGER)]
    #[ORM\GeneratedValue]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        Campaign::API_GET_ITEM,
    ])]
    private int $id;

    #[ORM\Column(type: Types::STRING, length: 255)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
        Campaign::API_GET_ITEM,
    ])]
    #[Assert\NotBlank]
    private string $name = '';

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
        Campaign::API_GET_ITEM,
    ])]
    private ?string $notes = null;

    #[ORM\ManyToOne(targetEntity: Campaign::class, inversedBy: 'scenes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([self::API_CREATE])]
    #[Assert\NotBlank]
    private Campaign $campaign;

    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'scene')]
    #[Groups([
        self::API_GET_ITEM,
        Campaign::API_GET_ITEM,
    ])]
    private Collection $images;

    #[ORM\OneToMany(targetEntity: SoundEffect::class, mappedBy: 'scene')]
    #[Groups([
        self::API_GET_ITEM,
        Campaign::API_GET_ITEM,
    ])]
    private Collection $soundEffects;

    #[ORM\OneToMany(targetEntity: Character::class, mappedBy: 'scene')]
    #[Groups([
        self::API_GET_ITEM,
        Campaign::API_GET_ITEM,
    ])]
    private Collection $characters;

    #[ORM\OneToMany(targetEntity: Soundtrack::class, mappedBy: 'scene')]
    #[Groups([
        self::API_GET_ITEM,
        Campaign::API_GET_ITEM,
    ])]
    private Collection $soundtracks;

    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->soundEffects = new ArrayCollection();
        $this->characters = new ArrayCollection();
        $this->soundtracks = new ArrayCollection();
    }

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

    public function getCampaign(): Campaign
    {
        return $this->campaign;
    }

    public function setCampaign(Campaign $campaign): self
    {
        $this->campaign = $campaign;

        return $this;
    }

    public function getImages(): Collection
    {
        return $this->images;
    }

    public function setImages(Collection $images): self
    {
        $this->images = $images;

        return $this;
    }

    public function getSoundEffects(): Collection
    {
        return $this->soundEffects;
    }

    public function setSoundEffects(Collection $soundEffects): void
    {
        $this->soundEffects = $soundEffects;
    }

    public function getCharacters(): Collection
    {
        return $this->characters;
    }

    public function setCharacters(Collection $characters): self
    {
        $this->characters = $characters;

        return $this;
    }

    public function getSoundtracks(): Collection
    {
        return $this->soundtracks;
    }

    public function setSoundtracks(Collection $soundtracks): self
    {
        $this->soundtracks = $soundtracks;

        return $this;
    }
}
