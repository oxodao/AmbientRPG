<?php

namespace App\Serializer;

use ApiPlatform\Metadata\IriConverterInterface;
use App\Entity\Image;
use App\Entity\SoundEffect;
use App\Entity\Soundtrack;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class DownloadableFileSerializer implements NormalizerInterface
{
    private const string ALREADY_CALLED = 'FILE_SERIALIZER_ALREADY_CALLED';

    public function __construct(
        #[Autowire(service: 'api_platform.jsonld.normalizer.item')]
        private readonly NormalizerInterface $normalizer,
        private readonly IriConverterInterface $iriConverter,
    )
    {
    }

    public function normalize(mixed $data, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        $data->url = \sprintf('%s/download', $this->iriConverter->getIriFromResource($data));

        return $this->normalizer->normalize($data, $format, $context);
    }

    public function supportsNormalization(mixed $data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Image || $data instanceof SoundEffect || $data instanceof Soundtrack;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            '*' => null,
            Image::class => true,
            SoundEffect::class => true,
            Soundtrack::class => true,
        ];
    }
}
