@extends('layouts.app')

@section('content')
<div class="flex h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
    <!-- Sidebar -->
    @include('components.sidebar')
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        @include('components.header')
        
        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto p-6">
            @yield('page-content')
        </main>
    </div>
</div>
@endsection
