# Generated by Django 3.2.8 on 2022-01-14 10:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20220108_1745'),
    ]

    operations = [
        migrations.CreateModel(
            name='ARPProcessPerson',
            fields=[
                ('id_card', models.IntegerField(primary_key=True, serialize=False, unique=True)),
                ('full_name', models.CharField(blank=True, max_length=254)),
                ('profession', models.CharField(blank=True, max_length=254)),
            ],
        ),
        migrations.RenameField(
            model_name='arpgroup',
            old_name='is_done',
            new_name='confirmed',
        ),
        migrations.AddField(
            model_name='arpdata',
            name='arp_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='arp_group', to='users.arpgroup'),
        ),
        migrations.AddField(
            model_name='arpdata',
            name='institute',
            field=models.CharField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='arpdata',
            name='int_assessor_name',
            field=models.CharField(blank=True, max_length=254),
        ),
        migrations.AddField(
            model_name='arpdata',
            name='project_name',
            field=models.CharField(blank=True, max_length=254),
        ),
        migrations.AlterField(
            model_name='arpgroup',
            name='gen_date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='graduateprofile',
            name='i_date',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='i_date', to='users.dategroup'),
        ),
        migrations.AddField(
            model_name='arpdata',
            name='president',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='president', to='users.arpprocessperson'),
        ),
        migrations.AddField(
            model_name='arpdata',
            name='secretary',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='secretary', to='users.arpprocessperson'),
        ),
        migrations.AddField(
            model_name='arpdata',
            name='vocal',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='vocal', to='users.arpprocessperson'),
        ),
    ]
