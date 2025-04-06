<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\GameType;
use App\Interface\HasCampaignInterface;
use App\Repository\CampaignRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(name: 'get_campaign'),
        new GetCollection(normalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_GET_COLLECTION],
        ]),
        new Post(denormalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_CREATE],
        ]),
        new Patch(denormalizationContext: [
            AbstractNormalizer::GROUPS => [self::API_UPDATE],
        ]),
        new Delete(normalizationContext: [AbstractNormalizer::GROUPS => []]),
    ],
    normalizationContext: [
        AbstractNormalizer::GROUPS => [self::API_GET_ITEM, Image::API_GET_ITEM, SoundEffect::API_GET_ITEM, Character::API_GET_ITEM, EffectSet::API_GET_ITEM],
    ],
)]
#[ORM\Entity(repositoryClass: CampaignRepository::class)]
class Campaign implements HasCampaignInterface
{
    public const string API_GET_ITEM = 'api:campaigns:get';
    public const string API_GET_COLLECTION = 'api:campaigns:get-collection';
    public const string API_CREATE = 'api:campaigns:create';
    public const string API_UPDATE = 'api:campaigns:update';

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

    #[ORM\Column(type: Types::STRING, length: 255, nullable: false, enumType: GameType::class)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    private GameType $gameType;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([
        self::API_GET_ITEM,
        self::API_GET_COLLECTION,
        self::API_CREATE,
        self::API_UPDATE,
    ])]
    private ?string $notes = null;

    #[ORM\OneToMany(targetEntity: Scene::class, mappedBy: 'campaign')]
    #[Groups([
        self::API_GET_ITEM,
    ])]
    #[ORM\OrderBy(['name' => 'ASC'])]
    private Collection $scenes;

    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'campaign')]
    #[Groups([
        self::API_GET_ITEM,
    ])]
    private Collection $images;

    #[ORM\OneToMany(targetEntity: SoundEffect::class, mappedBy: 'campaign')]
    #[Groups([
        self::API_GET_ITEM,
    ])]
    private Collection $soundEffects;

    #[ORM\OneToMany(targetEntity: Character::class, mappedBy: 'campaign')]
    #[Groups([
        self::API_GET_ITEM,
    ])]
    private Collection $characters;

    #[ORM\OneToMany(targetEntity: Soundtrack::class, mappedBy: 'campaign')]
    #[Groups([
        self::API_GET_ITEM,
    ])]
    private Collection $soundtracks;

    #[ORM\OneToMany(targetEntity: EffectSet::class, mappedBy: 'campaign')]
    #[Groups([
        self::API_GET_ITEM,
    ])]
    private Collection $effectSets;

    public function __construct()
    {
        $this->scenes = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->soundEffects = new ArrayCollection();
        $this->characters = new ArrayCollection();
        $this->soundtracks = new ArrayCollection();
        $this->effectSets = new ArrayCollection();
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

    public function getGameType(): GameType
    {
        return $this->gameType;
    }

    public function setGameType(GameType $gameType): self
    {
        $this->gameType = $gameType;

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

    public function getScenes(): Collection
    {
        return $this->scenes;
    }

    public function setScenes(Collection $scenes): self
    {
        $this->scenes = $scenes;

        return $this;
    }

    public function addScene(Scene $s): self
    {
        if (!$this->scenes->contains($s)) {
            $this->scenes->add($s);
            $s->setCampaign($this);
        }

        return $this;
    }

    public function removeScene(Scene $s): self
    {
        $this->scenes->removeElement($s);

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

    public function getCampaign(): Campaign
    {
        return $this;
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

    public function getEffectSets(): Collection
    {
        return $this->effectSets;
    }

    public function setEffectSets(Collection $effectSets): self
    {
        $this->effectSets = $effectSets;

        return $this;
    }
}
