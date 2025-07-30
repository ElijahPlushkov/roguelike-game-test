<?php

class Router {
    private array $routes = [];

    public function add(string $method, string $path, array $controller) {
        $path = $this->normalizePath($path);
        $this->routes[] = [
            'path' => $path,
            'method' => strtoupper($method),
            'controller' => $controller,
            'middlewares' => []
        ];

    }

    private function normalizePath(string $path): string {

        $path = trim($path, '/');
        return $path === '' ? '/' : '/' . $path;
    }

    public function dispatch(string $path) {
        $path = $this->normalizePath($path);

        error_log("Normalized request path: {$path}");

        $method = strtoupper($_SERVER['REQUEST_METHOD']);

        error_log("All registered routes:");
        foreach ($this->routes as $route) {
            error_log(" - {$route['method']} {$route['path']}");
        }

        foreach ($this->routes as $route) {
            if (!preg_match("#^{$route['path']}$#", $path) || $route['method'] !== $method) {
                continue;
            }

            [$class, $function] = $route['controller'];

            $controllerInstance = new $class;

            $controllerInstance->{$function}();

            return;
        }

        http_response_code(404);
        echo "404 - Page not found";
        error_log("No route matched for {$path}");
    }
}