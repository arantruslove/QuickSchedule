# Generated by Django 5.0.1 on 2024-06-28 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0012_alter_privateplan_fraction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='hours',
            field=models.FloatField(default=0),
        ),
    ]
