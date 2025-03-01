<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use App\Entity\Image;
use App\Entity\Scene;
use App\Entity\SoundEffect;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Path;
use Vich\UploaderBundle\FileAbstraction\ReplacingFile;

class SoundEffectFixtures extends Fixture implements DependentFixtureInterface
{
    public function __construct(
        #[Autowire(param: 'kernel.project_dir')]
        private string $projectDir,
    )
    {
    }

    public function getDependencies(): array
    {
        return [
            CampaignFixtures::class,
            SceneFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $cprFxs = [
            'Combat start' => ['file' => 'cpr/combat_start.mp3', 'loop' => false, 'shortname' => 'combat_start'],
            'Phone ring' => ['file' => 'cpr/phone_ring.mp3', 'loop' => true, 'shortname' => 'phone_ring'],
        ];

        foreach (['campaign_1', 'campaign_2', 'campaign_3'] as $cprCampaign) {
            foreach ($cprFxs as $k => $fxFile) {
                $fx = (new SoundEffect())
                    ->setName($k)
                    ->setCampaign($this->getReference($cprCampaign, Campaign::class))
                    ->setLoop($fxFile['loop'])
                    ->setFile(new ReplacingFile(Path::join(
                        $this->projectDir,
                        'src',
                        'DataFixtures',
                        'sound_effects',
                        $fxFile['file'],
                    )));

                $manager->persist($fx);
                $manager->flush();

                $shortName = $fxFile['shortname'];
                $this->setReference("sfx_{$cprCampaign}_$shortName", $fx);
            }
        }
    }
}
