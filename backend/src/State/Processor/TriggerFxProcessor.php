<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;

class TriggerFxProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly HubInterface $mercure,
    )
    {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $this->mercure->publish(new Update(
            topics: '/effects',
            data: $data->effectSet->getEffect(),
            private: true,
            type: '/effects',
        ));

        return new JsonResponse(status: 200);
    }
}
