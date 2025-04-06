<?php

namespace App\Enum;

enum GameType: string
{
    case CYBERPUNK_RED = 'cyberpunk';
    case FALLOUT = 'fallout';
    case DND = 'dnd';
    case GENERIC = 'generic';
}
