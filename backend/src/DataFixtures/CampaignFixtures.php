<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CampaignFixtures extends Fixture
{
    private function createCampaign(ObjectManager $manager, string $name): Campaign
    {
        $campain = (new Campaign())->setName($name);

        $manager->persist($campain);
        $manager->flush();

        $this->setReference('campaign_' . $campain->getId(), $campain);

        return $campain;
    }

    public function load(ObjectManager $manager): void
    {
        $this->createCampaign($manager, 'Cyberpunk RED - Groupe 1');
        $this->createCampaign($manager, 'Cyberpunk RED - Groupe 2');
        $this->createCampaign($manager, 'Cyberpunk RED - Groupe 3');
        $this->createCampaign($manager, 'Dungeons & Dragons - Groupe 1');
    }
}
