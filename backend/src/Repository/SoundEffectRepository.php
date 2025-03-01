<?php

namespace App\Repository;

use App\Entity\Image;
use App\Entity\SoundEffect;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SoundEffect>
 */
class SoundEffectRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SoundEffect::class);
    }
}
