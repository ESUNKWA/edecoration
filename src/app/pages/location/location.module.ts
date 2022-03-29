import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "src/app/shared/ui/ui.module";
import { LocationRoutingModule } from "./location-routing.module";
import { LocationComponent } from "./location.component";

@NgModule({
    declarations: [LocationComponent],
    imports: [
        CommonModule,
        UIModule,
        FormsModule,
        ReactiveFormsModule,
        LocationRoutingModule
    ]
})

export class LocationModule { }