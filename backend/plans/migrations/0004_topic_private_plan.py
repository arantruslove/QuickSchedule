# Generated by Django 5.0.1 on 2024-06-20 19:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plans', '0003_topic'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='private_plan',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='plans.privateplan'),
            preserve_default=False,
        ),
    ]
