<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\ImageRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Vich\UploaderBundle\Handler\DownloadHandler;

readonly class ImageProvider implements ProviderInterface
{
    public function __construct(
        private ImageRepository $imageRepository,
        private DownloadHandler $downloadHandler,
    )
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $id = $uriVariables['id'];
        $image = $this->imageRepository->find($id);

        if (!$image) {
            throw new NotFoundHttpException();
        }

        return $this->downloadHandler->downloadObject(
            $image,
            'file',
            forceDownload: false,
        );
    }
}
