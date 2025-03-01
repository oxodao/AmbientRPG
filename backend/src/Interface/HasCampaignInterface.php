<?php

namespace App\Interface;

use App\Entity\Campaign;

interface HasCampaignInterface
{
    public function getCampaign(): Campaign;
}
