<?php

namespace App\DataFixtures;

use App\Entity\Campaign;
use App\Entity\Scene;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class SceneFixtures extends Fixture implements DependentFixtureInterface
{
    private const string CP77_PRESENTATION_NOTES = <<<NOTES
# Présentation univers

Bienvenue dans **Night City**, 2045.
Le monde que nous connaissions s'est effondré lors de la **4ème Guerre Corporative**, quand les deux géants Arasaka et Militech - l'un spécialisé dans la sécurité et la technologie militaire, l'autre dans l'armement et les services militaires privés - se sont entre-déchirés pour le contrôle du marché mondial.

Les méga-corporations règnent désormais sur les ruines d'une société où la classe moyenne a disparu, ne laissant que les ultra-riches dans leurs tours de verre et la masse des débrouillards qui survivent dans les rues.

Night City s'est relevée de ses cendres, ville tentaculaire où les gangs font la loi dans les quartiers abandonnés pendant que les corporatistes manipulent les fils du pouvoir depuis leurs gratte-ciels.

La technologie est omniprésente : implants cybernétiques, intelligence artificielle, réalité augmentée... tout est à vendre pour qui a les eddies nécessaires.

Les rues grouillent sous les néons agressifs et les hologrammes publicitaires qui vantent le dernier soda à la mode ou la nouvelle clinique de chirurgie esthétique du coin, chacun perdu dans sa propre réalité augmentée, ignorant son voisin comme la crasse qui s'accumule entre les buildings.

Dans ce monde impitoyable, vous êtes des edgerunners - des mercenaires, des fixers, des netrunners, des techies - qui naviguez entre les différentes strates de la société. Votre réputation est votre seul véritable capital. Les règles sont simples : ne fais jamais confiance aux corpos, garde toujours une balle dans le chargeur, et surtout, ne perds jamais ton style.
NOTES;


    public function getDependencies(): array
    {
        return [
            CampaignFixtures::class,
        ];
    }

    private function createScene(ObjectManager $manager, string $campaign, string $name, string|null $notes = null): Scene
    {
        $scene = (new Scene())
            ->setName($name)
            ->setCampaign($this->getReference($campaign, Campaign::class))
            ->setNotes($notes)
        ;

        $manager->persist($scene);
        $manager->flush();

        $this->setReference('scene_' . $scene->getId(), $scene);

        return $scene;
    }

    public function load(ObjectManager $manager): void
    {
        foreach(['campaign_1', 'campaign_2', 'campaign_3'] as $campaign) {
            // Out of order just to be sure that this is not sorted on ID
            $this->createScene($manager, $campaign, '0 - Présentation univers', self::CP77_PRESENTATION_NOTES);
            $this->createScene($manager, $campaign, '1 - Funérailles');
            $this->createScene($manager, $campaign, '7 - Infiltration');
            $this->createScene($manager, $campaign, '2 - Discussion au bar');
            $this->createScene($manager, $campaign, '6 - Détourner un AV');
            $this->createScene($manager, $campaign, '3 - NCPD');
            $this->createScene($manager, $campaign, '5 - Confrontation vendeur');
            $this->createScene($manager, $campaign, '4 - RDV Fixer');
            $this->createScene($manager, $campaign, '8 - Payday!');
        }

        $this->createScene($manager, 'campaign_4', 'Scene1');
        $this->createScene($manager, 'campaign_4', 'Scene2');
        $this->createScene($manager, 'campaign_4', 'Scene3');
    }
}
