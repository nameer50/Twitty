# Generated by Django 4.0.6 on 2022-08-08 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0007_alter_profile_following'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='post',
            field=models.CharField(default='', max_length=2000),
        ),
    ]
