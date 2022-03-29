import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UIModule } from "src/app/shared/ui/ui.module";
import { TestRoutingModule } from "./test-routing.module";
import { TestComponent } from "./test.component";

@NgModule({
  declarations: [TestComponent],
  imports: [
      CommonModule,
      TestRoutingModule,
      UIModule,
      FormsModule,
      ReactiveFormsModule,
  ]
})

export class TestModule { }