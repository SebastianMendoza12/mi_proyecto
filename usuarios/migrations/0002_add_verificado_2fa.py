# Generated migration
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='verificado_2fa',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='CodigoVerificacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo', models.CharField(max_length=6)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('expira_en', models.DateTimeField()),
                ('usado', models.BooleanField(default=False)),
                ('tipo', models.CharField(
                    choices=[('registro', 'Registro'), ('login', 'Login')],
                    default='login',
                    max_length=20
                )),
                ('usuario', models.ForeignKey(
                    on_delete=models.deletion.CASCADE,
                    related_name='codigos',
                    to='usuarios.customuser'
                )),
            ],
            options={
                'ordering': ['-creado_en'],
            },
        ),
    ]