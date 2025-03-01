<?php

namespace App\DataFixtures;

use ApiPlatform\Metadata\IriConverterInterface;
use App\Entity\Campaign;
use App\Entity\EffectSet;
use App\Entity\SoundEffect;
use App\Entity\Soundtrack;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class EffectsFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        private IriConverterInterface $iriConverter,
    )
    {
    }

    public function getDependencies(): array
    {
        return [
            SoundEffectFixtures::class,
            SoundtrackFixtures::class,
        ];
    }

    private function createSleepEffect(string $name, int $duration): array
    {
        return [
            'name' => $name,
            'type' => 'sleep',
            'args' => [
                'duration' => $duration,
            ],
        ];
    }

    private function createSetLightEffect(string $name, array $devices, string $color, int $brightness): array
    {
        return [
            'name' => $name,
            'type' => 'set_light',
            'args' => [
                'device_names' => $devices,
                'color' => $color,
                'brightness' => $brightness,
            ],
        ];
    }

    private function createSoundEffect(string $name, SoundEffect $soundEffect): array
    {
        return [
            'name' => $name,
            'type' => 'sfx',
            'args' => [
                'iri' => $this->iriConverter->getIriFromResource($soundEffect),
            ],
        ];
    }

    private function createSoundtrack(string $name, Soundtrack $soundtrack): array
    {
        return [
            'name' => $name,
            'type' => 'soundtrack',
            'args' => [
                'iri' => $this->iriConverter->getIriFromResource($soundtrack),
            ],
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $ledDevices = ['bureau_ledstrip', 'canap_ledstrip', 'meubletv_ledstrip'];

        foreach (['campaign_1', 'campaign_2', 'campaign_3'] as $campaign) {
            $fxs = [
                'Standard' => [
                    $this->createSoundtrack('Standard soundtrack', $this->getReference("soundtrack_{$campaign}_general", Soundtrack::class)),
                    $this->createSetLightEffect('Setting the light color', $ledDevices, '#FFFFFF', 254),
                ],
                'Start combat' => [
                    $this->createSoundEffect('Start combat SFX', $this->getReference("sfx_{$campaign}_combat_start", SoundEffect::class)),
                    $this->createSoundtrack('Combat soundtrack', $this->getReference("soundtrack_{$campaign}_combat", Soundtrack::class)),
                    $this->createSetLightEffect('Setting the light color', $ledDevices, '#FF0000', 254),
                ],
                'Bar - Afterlife' => [
                    $this->createSoundtrack('Bar soundtrack', $this->getReference("soundtrack_{$campaign}_bar", Soundtrack::class)),
                    $this->createSetLightEffect('Setting the light color', $ledDevices, '#00FF00', 254),
                ]
            ];

            foreach ($fxs as $effectName => $effectData) {
                $effect = (new EffectSet())
                    ->setName($effectName)
                    ->setEffect(\json_encode($effectData))
                    ->setCampaign($this->getReference($campaign, Campaign::class))
                ;

                $manager->persist($effect);
                $manager->flush();

                $this->setReference("effectset_{$campaign}_{$effectName}", $effect);
            }
        }
    }
}
