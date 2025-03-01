<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250223180848 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE effect_set (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, searchable_name VARCHAR(255) NOT NULL, effect CLOB DEFAULT NULL, campaign_id INTEGER NOT NULL, CONSTRAINT FK_3C3E4DD3F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_3C3E4DD3F639F774 ON effect_set (campaign_id)');
        $this->addSql('DROP TABLE effect');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE effect (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL COLLATE "BINARY", searchable_name VARCHAR(255) NOT NULL COLLATE "BINARY", effect CLOB NOT NULL COLLATE "BINARY", campaign_id INTEGER NOT NULL, CONSTRAINT FK_B66091F2F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_B66091F2F639F774 ON effect (campaign_id)');
        $this->addSql('DROP TABLE effect_set');
    }
}
