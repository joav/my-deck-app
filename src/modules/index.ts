import { BaseModule } from "./base.module";
import { BoardModule } from "./board/board.module";
import { BoardsModule } from "./boards/boards.module";
import { ButtonsModule } from "./buttons/buttons.module";
import { CommandsModule } from "./commands/commands.module";
import { modalInstance } from "./modal/modal.module";

export function initModules() {
  const modules: BaseModule[] = [
    new CommandsModule(),
    new BoardModule(),
    new BoardsModule(),
    new ButtonsModule(),
    modalInstance,
  ];

  for (const module of modules) {
    if (module) {
      module.init();
    }
  }
}
