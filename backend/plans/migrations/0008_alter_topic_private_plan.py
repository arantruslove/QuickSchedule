# Generated by Django 5.0.1 on 2024-06-27 15:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0007_privateplan_is_selected'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topic',
            name='private_plan',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='topics', to='plans.privateplan'),
        ),
    ]
