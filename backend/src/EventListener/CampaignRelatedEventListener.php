<?php

namespace App\EventListener;

use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use App\ApiResource\State;
use App\Entity\Campaign;
use App\Interface\HasCampaignInterface;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

#[AsDoctrineListener(event: Events::postPersist)]
#[AsDoctrineListener(event: Events::postUpdate)]
#[AsDoctrineListener(event: Events::postRemove)]
readonly class CampaignRelatedEventListener
{
    public function __construct(
        private HubInterface $mercure,
        private NormalizerInterface $serializer,
        private ResourceMetadataCollectionFactoryInterface $resourceMetadataFactory,
    )
    {
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->doEventAction($args);
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->doEventAction($args);
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        // Removing a campaign should not result in anything
        if ($args->getObject() instanceof Campaign) {
            return;
        }

        $this->doEventAction($args);
    }

    private function doEventAction(LifecycleEventArgs $args): void
    {
        $object = $args->getObject();
        if (!$object instanceof HasCampaignInterface) {
            return;
        }

        $campaign = $object->getCampaign();
        $topic = \sprintf('/campaigns/%s', $campaign->getId());

        $rmc = $this->resourceMetadataFactory->create(Campaign::class);
        $getStateOperation = $rmc->getOperation('get_campaign');

        $this->mercure->publish(new Update(
            topics: $topic,
            data: \json_encode(
                $this->serializer->normalize(
                    $object->getCampaign(),
                    'jsonld',
                    $getStateOperation->getNormalizationContext(),
                ),
            ),
            private: true,
            type: $topic,
        ));
    }
}
