<?php
namespace Database\Seeders;

use App\Models\Don;
use App\Models\KareviaNotification;
use App\Models\Medecin;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ADMIN
        User::create(['name'=>'Admin Karevia','email'=>'admin@karevia.com',
            'password'=>Hash::make('password123'),'role'=>'admin','status'=>'active','is_verified'=>true]);

        // MÉDECINS
        $meds = [
            ['name'=>'Dr. Aïssata Kaboré',  'email'=>'dr.kabore@karevia.com',   'specialite'=>'Généraliste', 'zone'=>'Centre'],
            ['name'=>'Dr. Seydou Ouédraogo','email'=>'dr.ouedraogo@karevia.com', 'specialite'=>'Pédiatrie',   'zone'=>'Nord'],
            ['name'=>'Dr. Fatoumata Diallo','email'=>'dr.diallo@karevia.com',    'specialite'=>'Gynécologie', 'zone'=>'Sud'],
        ];
        foreach ($meds as $md) {
            $u = User::create(['name'=>$md['name'],'email'=>$md['email'],'password'=>Hash::make('password123'),
                'role'=>'medecin','status'=>'active','is_verified'=>true,'zone'=>$md['zone']]);
            Medecin::create(['user_id'=>$u->id,'specialite'=>$md['specialite'],'statut_validation'=>'valide',
                'tarif_solidaire'=>5,'teleconsultation_active'=>true,
                'disponibilites'=>['lundi'=>['09:00','09:30','10:00','14:00','14:30'],'mardi'=>['09:00','10:00','11:00'],
                    'mercredi'=>['14:00','15:00','16:00'],'jeudi'=>['09:00','10:00'],'vendredi'=>['09:00','10:00','11:00']]]);
        }

        // PATIENTS
        $patients = [
            ['name'=>'Awa Traoré',    'email'=>'awa@test.com',    'role'=>'vulnerable','verified'=>true, 'zone'=>'Centre'],
            ['name'=>'Moussa Saw.',   'email'=>'moussa@test.com', 'role'=>'vulnerable','verified'=>false,'zone'=>'Nord'],
            ['name'=>'Mariam C.',     'email'=>'mariam@test.com', 'role'=>'standard',  'verified'=>true, 'zone'=>'Sud'],
        ];
        foreach ($patients as $pd) {
            $u = User::create(['name'=>$pd['name'],'email'=>$pd['email'],'password'=>Hash::make('password123'),
                'role'=>$pd['role'],'status'=>$pd['verified']?'active':'pending','is_verified'=>$pd['verified'],'zone'=>$pd['zone']]);
            Patient::create(['user_id'=>$u->id,'niveau_acces'=>$pd['role']==='vulnerable'?'gratuit':'solidaire']);
        }

        // ONG
        $ong = User::create(['name'=>'ONG Solidarité Sahel','email'=>'ong@karevia.com',
            'password'=>Hash::make('password123'),'role'=>'ong','status'=>'active','is_verified'=>true,'zone'=>'Centre']);

        // DONS
        foreach ([
            ['nourriture','Riz 50kg',50,'kg','Centre'],
            ['medicaments','Paracétamol x500',500,'comprimés','Nord'],
            ['transport','Véhicule 1 journée',1,'jour','Sud'],
        ] as [$type,$desc,$qte,$unite,$zone]) {
            Don::create(['donateur_id'=>$ong->id,'type'=>$type,'description'=>$desc,'quantite'=>$qte,
                'unite'=>$unite,'zone_livraison'=>$zone,'statut'=>'valide','association_id'=>$ong->id]);
        }

        User::all()->each(fn($u) =>
            KareviaNotification::create(['user_id'=>$u->id,'type'=>'info','message'=>'Bienvenue sur Karevia !'])
        );

        $this->command->info('✅ DB seeded! Comptes: admin@karevia.com / dr.kabore@karevia.com / awa@test.com / ong@karevia.com (mdp: password123)');
    }
}
