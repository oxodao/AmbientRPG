<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250219152642 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__sound_effect AS SELECT id, name, searchable_name, background, filename, updated_at, scene_id, campaign_id FROM sound_effect');
        $this->addSql('DROP TABLE sound_effect');
        $this->addSql('CREATE TABLE sound_effect (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, searchable_name VARCHAR(255) NOT NULL, loop BOOLEAN NOT NULL, filename VARCHAR(255) DEFAULT NULL, updated_at DATETIME DEFAULT NULL, scene_id INTEGER DEFAULT NULL, campaign_id INTEGER NOT NULL, CONSTRAINT FK_E972E431166053B4 FOREIGN KEY (scene_id) REFERENCES scene (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_E972E431F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO sound_effect (id, name, searchable_name, loop, filename, updated_at, scene_id, campaign_id) SELECT id, name, searchable_name, background, filename, updated_at, scene_id, campaign_id FROM __temp__sound_effect');
        $this->addSql('DROP TABLE __temp__sound_effect');
        $this->addSql('CREATE INDEX IDX_E972E431F639F774 ON sound_effect (campaign_id)');
        $this->addSql('CREATE INDEX IDX_E972E431166053B4 ON sound_effect (scene_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__sound_effect AS SELECT id, name, searchable_name, loop, filename, updated_at, scene_id, campaign_id FROM sound_effect');
        $this->addSql('DROP TABLE sound_effect');
        $this->addSql('CREATE TABLE sound_effect (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, searchable_name VARCHAR(255) NOT NULL, background BOOLEAN NOT NULL, filename VARCHAR(255) DEFAULT NULL, updated_at DATETIME DEFAULT NULL, scene_id INTEGER DEFAULT NULL, campaign_id INTEGER NOT NULL, CONSTRAINT FK_E972E431166053B4 FOREIGN KEY (scene_id) REFERENCES scene (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_E972E431F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO sound_effect (id, name, searchable_name, background, filename, updated_at, scene_id, campaign_id) SELECT id, name, searchable_name, loop, filename, updated_at, scene_id, campaign_id FROM __temp__sound_effect');
        $this->addSql('DROP TABLE __temp__sound_effect');
        $this->addSql('CREATE INDEX IDX_E972E431166053B4 ON sound_effect (scene_id)');
        $this->addSql('CREATE INDEX IDX_E972E431F639F774 ON sound_effect (campaign_id)');
    }
}
