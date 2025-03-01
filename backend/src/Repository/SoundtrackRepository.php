<?php

namespace App\Repository;

use App\Entity\Image;
use App\Entity\SoundEffect;
use App\Entity\Soundtrack;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Soundtrack>
 */
class SoundtrackRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Soundtrack::class);
    }
}
