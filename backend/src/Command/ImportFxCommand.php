<?php

namespace App\Command;

use App\Entity\EffectSet;
use App\Repository\CampaignRepository;
use App\Repository\SceneRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand("import:fx")]
class ImportFxCommand extends Command
{
    public function __construct(
        private readonly CampaignRepository     $campaignRepository,
        private readonly EntityManagerInterface $emi,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument(
                "name",
                InputArgument::REQUIRED,
                "The name of the FX",
            )
            ->addArgument(
                "file",
                InputArgument::REQUIRED,
                "The json file that contains the effect",
            )
            ->addArgument(
                "campaign",
                InputArgument::REQUIRED,
                "The campaign name",
            )
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $name = $input->getArgument("name");
        $file = $input->getArgument("file");
        $campaign = $input->getArgument("campaign");

        if (!\file_exists($file)) {
            $io->error("File not found");
            return Command::FAILURE;
        }

        $campaign = $this->campaignRepository->findoneBy(['name' => $campaign]);
        if (!$campaign) {
            $io->error("Campaign not found");
            return Command::FAILURE;
        }

        $fxData = \file_get_contents($file);

        $fx = (new EffectSet())
            ->setName($name)
            ->setCampaign($campaign)
            ->setEffect($fxData)
        ;

        $this->emi->persist($fx);
        $this->emi->flush();

        $io->success("Effect created");

        return Command::SUCCESS;
    }
}
