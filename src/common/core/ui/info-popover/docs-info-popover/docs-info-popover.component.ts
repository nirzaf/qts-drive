import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'docs-info-popover',
  templateUrl: './docs-info-popover.component.html',
  styleUrls: ['./docs-info-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocsInfoPopoverComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
