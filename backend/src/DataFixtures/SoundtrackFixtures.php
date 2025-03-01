<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use App\Entity\Image;
use App\Entity\Scene;
use App\Entity\SoundEffect;
use App\Entity\Soundtrack;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Path;
use Vich\UploaderBundle\FileAbstraction\ReplacingFile;

class SoundtrackFixtures extends Fixture implements DependentFixtureInterface
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
            'Combat' => ['filename' => 'combat.mp3', 'shortname' => 'combat'],
            'General' => ['filename' => 'general.mp3', 'shortname' => 'general'],
            'Bar' => ['filename' => 'bar.mp3', 'shortname' => 'bar'],
        ];

        foreach (['campaign_1', 'campaign_2', 'campaign_3'] as $cprCampaign) {
            foreach ($cprFxs as $k => $fxFile) {
                $fx = (new Soundtrack())
                    ->setName($k)
                    ->setCampaign($this->getReference($cprCampaign, Campaign::class))
                    ->setFile(new ReplacingFile(Path::join(
                        $this->projectDir,
                        'src',
                        'DataFixtures',
                        'soundtrack',
                        $fxFile['filename'],
                    )));

                $manager->persist($fx);
                $manager->flush();

                $shortName = $fxFile['shortname'];
                $this->setReference("soundtrack_{$cprCampaign}_$shortName", $fx);
            }
        }
    }
}
