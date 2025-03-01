<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use App\Entity\Character;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class CharacterFixtures extends Fixture implements DependentFixtureInterface
{
    public function getDependencies(): array
    {
        return [
            CampaignFixtures::class,
            SceneFixtures::class,
        ];
    }

    public function load(ObjectManager $manager): void
    {
        $players = [
            'campaign_1' => [
                ['name' => 'Redeye', 'class' => 'Netrunner', 'playedBy' => 'Cassandre'],
                ['name' => 'Torch', 'class' => 'Techie', 'playedBy' => 'Juliette'],
                ['name' => 'Grease', 'class' => 'Fixer', 'playedBy' => 'Coralie'],
                ['name' => 'Mover', 'class' => 'Solo', 'playedBy' => 'Salomé'],
            ],
            'campaign_2' => [
                ['name' => 'Torch', 'class' => 'Techie', 'playedBy' => 'Matthieu'],
                ['name' => 'Grease', 'class' => 'Fixer', 'playedBy' => 'Simon'],
                ['name' => 'Redeye', 'class' => 'Netrunner', 'playedBy' => 'Antoine'],
                ['name' => 'Mover', 'class' => 'Solo', 'playedBy' => 'Juliette'],
            ],
            'campaign_3' => [
                ['name' => 'Torch', 'class' => 'Techie', 'playedBy' => 'Yacine'],
                ['name' => 'Mover', 'class' => 'Solo', 'playedBy' => 'Pierre'],
                ['name' => 'Redeye', 'class' => 'Netrunner', 'playedBy' => 'Paul'],
                ['name' => 'Grease', 'class' => 'Fixer', 'playedBy' => 'Sophie'],
            ],
        ];

        $npcs = [
            ['name' => 'Kerry', 'class' => 'Voodooboy Seller'],
            ['name' => 'Alfred', 'class' => 'Fixer'],
            ['name' => 'Charles', 'class' => 'Merchant'],
        ];

        foreach ($players as $campaign => $campaignPlayers) {
            $campaign = $this->getReference($campaign, Campaign::class);

            /**
             * Creating the NPC first just to be sure the sorting is working
             */
            foreach ($npcs as $npc) {
                $this->createCharacter($manager, $campaign, $npc);
            }

            foreach ($campaignPlayers as $player) {
                $this->createCharacter($manager, $campaign, $player);
            }
        }
    }

    private function createCharacter(ObjectManager $manager, Campaign $campaign, array $chr): void
    {
        $player = (new Character())
            ->setName($chr['name'])
            ->setClass($chr['class'])
            ->setNpc(false)
            ->setNotes(null)
            ->setCampaign($campaign)
            ->setScene(null)
        ;

        if (\array_key_exists('playedBy', $chr)) {
            $player->setPlayedBy($chr['playedBy']);
        } else {
            $player->setNpc(true);
        }

        $manager->persist($player);
        $manager->flush();

        $this->setReference('character_'.$player->getId(), $player);
    }
}
