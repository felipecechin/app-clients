<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        $numItemsPage = 10;
        if ($request->get('page')) {
            $page = $request->get('page');
            $offset = ($page - 1) * $numItemsPage;
        } else {
            $offset = 0;
        }

        if ($request->get('search')) {
            $search = '%' . $request->get('search') . '%';
        } else {
            $search = '%%';
        }

        $results = DB::select('select * from clients where name like ? or email like ? order by name limit ' . $offset . ',' . $numItemsPage, [$search, $search]);
        $total = DB::select('select count(*) as num from clients where name like ? or email like ?', [$search, $search]);
        $total = $total[0]->num;
        return response()->json(['total' => $total, 'clients' => $results]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $rules = [
            'name' => 'required|regex:/^[a-zA-ZÀ-ú ]+$/',
            'birthdate' => 'required|date_format:d/m/Y',
            'cellphone' => 'required',
            'cpf' => 'required|cpf|unique:clients,cpf',
            'email' => 'required',
            'address' => 'required',
            'note' => 'max:300'
        ];
        $messages = [
            'name.required' => 'O campo name é obrigatório',
            'name.regex' => 'O campo name não pode ter caracteres especiais',
            'birthdate.required' => 'O campo data de nascimento é obrigatório',
            'birthdate.date_format' => 'Data de nascimento deve ser válida',
            'cellphone.required' => 'O campo cellphone é obrigatório',
            'cpf.required' => 'O campo CPF é obrigatório',
            'cpf.cpf' => 'CPF deve ser válido',
            'cpf.unique' => 'CPF já existe',
            'email.required' => 'O campo e-mail é obrigatório',
            'address.required' => 'O campo endereço é obrigatório',
            'note.max' => 'O campo observação deve ter no máximo 300 caracteres'
        ];

        $validator = Validator::make($request->toArray(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }


        $birthDate = DateTime::createFromFormat('d/m/Y', $request->get('birthdate'));
        $birthDate = $birthDate->format('Y-m-d');
        $values = [$request->get('name'),
            $birthDate,
            $request->get('cellphone'),
            $request->get('cpf'),
            $request->get('email'),
            $request->get('address'),
            $request->get('note')];

        DB::insert('insert into clients
                            (name, birthdate, cellphone, cpf, email, address, note)
                            values (?, ?, ?, ?, ?, ?, ?)', $values);

        return response()->json(['message' => 'Cliente inserido com sucesso'], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $results = DB::select('select * from clients where id=?', [$id]);
        if (count($results) == 0) {
            return response()->json(['error' => 'Recurso pesquisado não existe'], 404);
        }
        return response()->json($results[0]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id) {
        $results = DB::select('select * from clients where id=?', [$id]);
        if (count($results) == 0) {
            return response()->json(['error' => 'Recurso pesquisado não existe'], 404);
        }
        $idCliente = $results[0]->id;
        $rules = [
            'name' => 'required|regex:/^[a-zA-ZÀ-ú ]+$/',
            'birthdate' => 'required|date_format:d/m/Y',
            'cellphone' => 'required',
            'cpf' => 'required|cpf|unique:clients,cpf,' . $idCliente,
            'email' => 'required',
            'address' => 'required',
            'note' => 'max:300'
        ];
        $messages = [
            'name.required' => 'O campo name é obrigatório',
            'name.regex' => 'O campo name não pode ter caracteres especiais',
            'birthdate.required' => 'O campo data de nascimento é obrigatório',
            'birthdate.date_format' => 'Data de nascimento deve ser válida',
            'cellphone.required' => 'O campo cellphone é obrigatório',
            'cpf.required' => 'O campo CPF é obrigatório',
            'cpf.cpf' => 'CPF deve ser válido',
            'cpf.unique' => 'CPF já existe',
            'email.required' => 'O campo e-mail é obrigatório',
            'address.required' => 'O campo endereço é obrigatório',
            'note.max' => 'O campo observação deve ter no máximo 300 caracteres'
        ];

        $validator = Validator::make($request->toArray(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        $birthDate = DateTime::createFromFormat('d/m/Y', $request->get('birthdate'));
        $birthDate = $birthDate->format('Y-m-d');
        $values = ['name' => $request->get('name'),
            'birthdate' => $birthDate,
            'cellphone' => $request->get('cellphone'),
            'cpf' => $request->get('cpf'),
            'email' => $request->get('email'),
            'address' => $request->get('address'),
            'note' => $request->get('note'),
            'id' => $idCliente];

        DB::update(
            'update clients set name = :name,
                    birthdate = :birthdate,
                    cellphone = :cellphone,
                    cpf = :cpf,
                    email = :email,
                    address = :address,
                    note = :note
                    where id = :id',
            $values
        );
        return response()->json(['message' => 'Cliente atualizado com sucesso']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        $results = DB::select('select * from clients where id=?', [$id]);
        if (count($results) == 0) {
            return response()->json(['error' => 'Recurso pesquisado não existe'], 404);
        }
        DB::delete('delete from clients where id = ?', [$id]);
        return response()->json(['message' => 'Cliente removido com sucesso']);
    }
}
