<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClienteController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $results = DB::select('select * from clientes');
        return response()->json($results);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        $rules = [
            'nome' => 'required|regex:/^[a-zA-ZÀ-ú ]+$/',
            'data_nascimento' => 'required|date_format:d/m/Y',
            'celular' => 'required',
            'cpf' => 'required|cpf',
            'email' => 'required',
            'endereco' => 'required',
            'observacao' => 'max:300'
        ];
        $messages = [
            'nome.required' => 'O campo nome é obrigatório',
            'nome.regex' => 'O campo nome não pode ter caracteres especiais',
            'data_nascimento.required' => 'O campo data de nascimento é obrigatório',
            'data_nascimento.date_format' => 'Data de nascimento deve ser válida',
            'celular.required' => 'O campo celular é obrigatório',
            'cpf.required' => 'O campo CPF é obrigatório',
            'cpf.cpf' => 'CPF deve ser válido',
            'email.required' => 'O campo e-mail é obrigatório',
            'endereco.required' => 'O campo endereço é obrigatório',
            'observacao.max' => 'O campo observação deve ter no máximo 300 caracteres'
        ];

        $validator = Validator::make($request->toArray(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['erro' => $validator->messages()], 400);
        }


        $birthDate = DateTime::createFromFormat('d/m/Y', $request->get('data_nascimento'));
        $birthDate = $birthDate->format('Y-m-d');
        $values = [$request->get('nome'),
            $birthDate,
            $request->get('celular'),
            $request->get('cpf'),
            $request->get('email'),
            $request->get('endereco'),
            $request->get('observacao')];

        DB::insert('insert into clientes
                            (nome, data_nascimento, celular, cpf, email, endereco, observacao)
                            values (?, ?, ?, ?, ?, ?, ?)', $values);

        return response()->json(['mensagem' => 'Cliente inserido com sucesso'], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id) {
        $results = DB::select('select * from clientes where id=?', [$id]);
        if (count($results) == 0) {
            return response()->json(['erro' => 'Recurso pesquisado não existe'], 404);
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
        $results = DB::select('select * from clientes where id=?', [$id]);
        if (count($results) == 0) {
            return response()->json(['erro' => 'Recurso pesquisado não existe'], 404);
        }
        $idCliente = $results[0]->id;
        $rules = [
            'nome' => 'required|regex:/^[a-zA-ZÀ-ú ]+$/',
            'data_nascimento' => 'required|date_format:d/m/Y',
            'celular' => 'required',
            'cpf' => 'required|cpf',
            'email' => 'required',
            'endereco' => 'required',
            'observacao' => 'max:300'
        ];
        $messages = [
            'nome.required' => 'O campo nome é obrigatório',
            'nome.regex' => 'O campo nome não pode ter caracteres especiais',
            'data_nascimento.required' => 'O campo data de nascimento é obrigatório',
            'data_nascimento.date_format' => 'Data de nascimento deve ser válida',
            'celular.required' => 'O campo celular é obrigatório',
            'cpf.required' => 'O campo CPF é obrigatório',
            'cpf.cpf' => 'CPF deve ser válido',
            'email.required' => 'O campo e-mail é obrigatório',
            'endereco.required' => 'O campo endereço é obrigatório',
            'observacao.max' => 'O campo observação deve ter no máximo 300 caracteres'
        ];

        $validator = Validator::make($request->toArray(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['erro' => $validator->messages()], 400);
        }

        $birthDate = DateTime::createFromFormat('d/m/Y', $request->get('data_nascimento'));
        $birthDate = $birthDate->format('Y-m-d');
        $values = ['nome' => $request->get('nome'),
            'data_nascimento' => $birthDate,
            'celular' => $request->get('celular'),
            'cpf' => $request->get('cpf'),
            'email' => $request->get('email'),
            'endereco' => $request->get('endereco'),
            'observacao' => $request->get('observacao'),
            'id' => $idCliente];

        DB::update(
            'update clientes set nome = :nome,
                    data_nascimento = :data_nascimento,
                    celular = :celular,
                    cpf = :cpf,
                    email = :email,
                    endereco = :endereco,
                    observacao = :observacao
                    where id = :id',
            $values
        );
        return response()->json(['mensagem' => 'Cliente atualizado com sucesso']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id) {
        $results = DB::select('select * from clientes where id=?', [$id]);
        if (count($results) == 0) {
            return response()->json(['erro' => 'Recurso pesquisado não existe'], 404);
        }
        DB::delete('delete from clientes where id = ?', [$id]);
        return response()->json(['mensagem' => 'Cliente removido com sucesso']);
    }
}
