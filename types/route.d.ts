import "vue-router";

declare module "vue-router" {
    interface RouteMeta {
        guest?: boolean;
        layout?: string;
    }
}
