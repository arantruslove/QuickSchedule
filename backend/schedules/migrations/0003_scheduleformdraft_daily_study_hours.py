# Generated by Django 5.0.1 on 2024-06-22 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0002_alter_scheduleformdraft_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='scheduleformdraft',
            name='daily_study_hours',
            field=models.JSONField(null=True),
        ),
    ]
