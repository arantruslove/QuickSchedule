# Generated by Django 5.0.1 on 2024-06-21 10:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0005_alter_topic_private_plan'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='hours',
            field=models.FloatField(default=0.5),
            preserve_default=False,
        ),
    ]
