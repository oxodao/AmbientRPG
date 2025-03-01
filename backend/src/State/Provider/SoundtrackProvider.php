<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Soundtrack;
use App\Repository\ImageRepository;
use App\Repository\SoundEffectRepository;
use App\Repository\SoundtrackRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Vich\UploaderBundle\Handler\DownloadHandler;

/**
 * @TODO:
 * Generify this using the operation's class to get the correct repository
 */

readonly class SoundtrackProvider implements ProviderInterface
{
    public function __construct(
        private SoundtrackRepository $ostRepository,
        private DownloadHandler      $downloadHandler,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'];
        $fx = $this->ostRepository->find($id);

        if (!$fx) {
            throw new NotFoundHttpException();
        }

        return $this->downloadHandler->downloadObject(
            $fx,
            'file',
            forceDownload: false,
        );
    }
}
