<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\ApiResource\State;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\SerializerInterface;

readonly class StateProvider implements ProviderInterface
{
    public function __construct(
        #[Autowire(param: 'config_file')]
        private string $configFile,
        private SerializerInterface $serializer,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $output = new State();

        if (\file_exists($this->configFile)) {
            $fileData = file_get_contents($this->configFile);
            $output = $this->serializer->deserialize($fileData, State::class, 'json');
        }

        $output->displayedImages = \array_filter($output->displayedImages, fn($x) => !!$x);

        return $output;
    }
}
