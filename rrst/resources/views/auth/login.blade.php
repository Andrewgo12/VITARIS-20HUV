@extends('layouts.app')

@section('title', 'Iniciar Sesión - VITAL RED')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <!-- Logo and Header -->
        <div class="text-center">
            <div class="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i data-lucide="heart-pulse" class="w-8 h-8 text-white"></i>
            </div>
            <h2 class="mt-6 text-3xl font-bold text-slate-900 font-manrope">VITAL RED</h2>
            <p class="mt-2 text-sm text-slate-600">Sistema de Referencias Hospitalarias</p>
            <p class="text-xs text-slate-500 mt-1">Inicia sesión para acceder al sistema</p>
        </div>

        <!-- Login Form -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8">
            <form method="POST" action="{{ route('login') }}" class="space-y-6">
                @csrf
                
                <!-- Email Field -->
                <div>
                    <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
                        Correo Electrónico
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i data-lucide="mail" class="h-5 w-5 text-slate-400"></i>
                        </div>
                        <input id="email" 
                               name="email" 
                               type="email" 
                               autocomplete="email" 
                               required 
                               value="{{ old('email') }}"
                               class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors @error('email') border-red-500 @enderror"
                               placeholder="tu@email.com">
                    </div>
                    @error('email')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Password Field -->
                <div>
                    <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
                        Contraseña
                    </label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i data-lucide="lock" class="h-5 w-5 text-slate-400"></i>
                        </div>
                        <input id="password" 
                               name="password" 
                               type="password" 
                               autocomplete="current-password" 
                               required
                               class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors @error('password') border-red-500 @enderror"
                               placeholder="••••••••">
                    </div>
                    @error('password')
                        <p class="mt-2 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Remember Me -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" 
                               name="remember" 
                               type="checkbox" 
                               class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded">
                        <label for="remember" class="ml-2 block text-sm text-slate-700">
                            Recordarme
                        </label>
                    </div>
                    <div class="text-sm">
                        <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit" 
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <i data-lucide="log-in" class="h-5 w-5 text-white/80 group-hover:text-white transition-colors"></i>
                        </span>
                        Iniciar Sesión
                    </button>
                </div>
            </form>
        </div>

        <!-- Demo Credentials -->
        <div class="bg-slate-100/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
            <h3 class="text-sm font-medium text-slate-700 mb-2">Credenciales de Demostración:</h3>
            <div class="space-y-1 text-xs text-slate-600">
                <p><strong>Médico:</strong> medico@hospital.com / password</p>
                <p><strong>Admin:</strong> admin@hospital.com / password</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center">
            <p class="text-xs text-slate-500">
                © 2025 VITAL RED - Hospital Universitaria ESE
            </p>
        </div>
    </div>
</div>
@endsection
