<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use App\Entity\Image;
use App\Entity\Scene;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Path;
use Vich\UploaderBundle\FileAbstraction\ReplacingFile;

class ImageFixtures extends Fixture implements DependentFixtureInterface
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
        $cprBgs = ['cpr/0.jpg', 'cpr/1.jpg', 'cpr/2.jpg'];
        $sceneImages = [
            ['name' => 'katana', 'filename' => 'scene_0/1.jpg', 'scenes' => ['scene_1', 'scene_10', 'scene_19']],
            ['name' => 'NC Map', 'filename' => 'scene_0/2.webp', 'scenes' => ['scene_1', 'scene_10', 'scene_19']],
            ['name' => 'Cloud', 'filename' => 'scene_0/3.webp', 'scenes' => ['scene_1', 'scene_10', 'scene_19']],
        ];

        foreach (['campaign_1', 'campaign_2', 'campaign_3'] as $cprCampaign) {
            $i = 0;

            foreach ($cprBgs as $cprBg) {
                $image = (new Image())
                    ->setName(\sprintf("Background #%s", $i))
                    ->setCampaign($this->getReference($cprCampaign, Campaign::class))
                    ->setBackground(true)
                    ->setFile(new ReplacingFile(Path::join(
                        $this->projectDir,
                        'src',
                        'DataFixtures',
                        'images',
                        $cprBg,
                    )));

                $manager->persist($image);
                $manager->flush();

                $i++;
            }
        }

        $i = 0;
        foreach (['fallout/0.jpg', 'fallout/1.jpg', 'fallout/2.jpg'] as $falloutBg) {
            $image = (new Image())
                ->setName(\sprintf("Background #%s", $i))
                ->setCampaign($this->getReference('campaign_5', Campaign::class))
                ->setBackground(true)
                ->setFile(new ReplacingFile(Path::join(
                    $this->projectDir,
                    'src',
                    'DataFixtures',
                    'images',
                    $falloutBg,
                )));

            $manager->persist($image);
            $manager->flush();

            $i++;
        }

        foreach ($sceneImages as $fixtureSceneImage) {
            foreach($fixtureSceneImage['scenes'] as $sceneRef) {
                $sceneObj = $this->getReference($sceneRef, Scene::class);

                $image = (new Image())
                    ->setName($fixtureSceneImage['name'])
                    ->setCampaign($sceneObj->getCampaign())
                    ->setScene($sceneObj)
                    ->setBackground(false)
                    ->setFile(new ReplacingFile(Path::join(
                        $this->projectDir,
                        'src',
                        'DataFixtures',
                        'images',
                        'cpr',
                        $fixtureSceneImage['filename'],
                    )))
                ;

                $manager->persist($image);
                $manager->flush();
            }
        }
    }
}
