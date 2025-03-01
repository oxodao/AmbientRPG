<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250219123034 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE sound_effect (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, searchable_name VARCHAR(255) NOT NULL, background BOOLEAN NOT NULL, filename VARCHAR(255) DEFAULT NULL, updated_at DATETIME DEFAULT NULL, scene_id INTEGER DEFAULT NULL, campaign_id INTEGER NOT NULL, CONSTRAINT FK_E972E431166053B4 FOREIGN KEY (scene_id) REFERENCES scene (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_E972E431F639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_E972E431166053B4 ON sound_effect (scene_id)');
        $this->addSql('CREATE INDEX IDX_E972E431F639F774 ON sound_effect (campaign_id)');
        $this->addSql('CREATE TEMPORARY TABLE __temp__scene AS SELECT id, name, notes, campaign_id FROM scene');
        $this->addSql('DROP TABLE scene');
        $this->addSql('CREATE TABLE scene (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, notes CLOB DEFAULT NULL, campaign_id INTEGER NOT NULL, CONSTRAINT FK_D979EFDAF639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO scene (id, name, notes, campaign_id) SELECT id, name, notes, campaign_id FROM __temp__scene');
        $this->addSql('DROP TABLE __temp__scene');
        $this->addSql('CREATE INDEX IDX_D979EFDAF639F774 ON scene (campaign_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE sound_effect');
        $this->addSql('CREATE TEMPORARY TABLE __temp__scene AS SELECT id, name, notes, campaign_id FROM scene');
        $this->addSql('DROP TABLE scene');
        $this->addSql('CREATE TABLE scene (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, notes CLOB DEFAULT NULL, campaign_id INTEGER DEFAULT NULL, CONSTRAINT FK_D979EFDAF639F774 FOREIGN KEY (campaign_id) REFERENCES campaign (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO scene (id, name, notes, campaign_id) SELECT id, name, notes, campaign_id FROM __temp__scene');
        $this->addSql('DROP TABLE __temp__scene');
        $this->addSql('CREATE INDEX IDX_D979EFDAF639F774 ON scene (campaign_id)');
    }
}
