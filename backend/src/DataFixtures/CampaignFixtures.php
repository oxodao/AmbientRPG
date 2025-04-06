<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use App\Enum\GameType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class CampaignFixtures extends Fixture
{
    private function createCampaign(ObjectManager $manager, string $name, GameType $gameType): Campaign
    {
        $campain = (new Campaign())->setName($name)->setGameType($gameType);

        $manager->persist($campain);
        $manager->flush();

        $this->setReference('campaign_' . $campain->getId(), $campain);

        return $campain;
    }

    public function load(ObjectManager $manager): void
    {
        $this->createCampaign($manager, 'Cyberpunk RED - Groupe 1', GameType::CYBERPUNK_RED);
        $this->createCampaign($manager, 'Cyberpunk RED - Groupe 2', GameType::CYBERPUNK_RED);
        $this->createCampaign($manager, 'Cyberpunk RED - Groupe 3', GameType::CYBERPUNK_RED);
        $this->createCampaign($manager, 'Dungeons & Dragons - Groupe 1', GameType::DND);
        $this->createCampaign($manager, 'Fallout - Groupe 1', GameType::FALLOUT);
    }
}
