<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\ImageRepository;
use App\Repository\SoundEffectRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Vich\UploaderBundle\Handler\DownloadHandler;

readonly class SoundEffectProvider implements ProviderInterface
{
    public function __construct(
        private SoundEffectRepository $fxRepository,
        private DownloadHandler       $downloadHandler,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'];
        $fx = $this->fxRepository->find($id);

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
