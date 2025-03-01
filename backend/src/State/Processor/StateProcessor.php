<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Resource\Factory\ResourceMetadataCollectionFactoryInterface;
use ApiPlatform\State\ProcessorInterface;
use App\ApiResource\State;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

readonly class StateProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(param: 'config_file')]
        private string $configFile,
        private NormalizerInterface $serializer,
        private HubInterface $mercure,
        private ResourceMetadataCollectionFactoryInterface $resourceMetadataFactory,
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $data->displayedImages = \array_filter($data->displayedImages, fn($x) => !!$x);

        file_put_contents(
            $this->configFile,
            \json_encode($this->serializer->normalize($data, 'jsonld', [
                AbstractNormalizer::GROUPS => [State::API_SET],
            ])),
        );

        $rmc = $this->resourceMetadataFactory->create(State::class);
        $getStateOperation = $rmc->getOperation('get_state');

        $this->mercure->publish(new Update(
            topics: '/state',
            data: json_encode($this->serializer->normalize($data, 'jsonld', $getStateOperation->getNormalizationContext())),
            private: true,
            type: '/state',
        ));

        return $data;
    }
}
