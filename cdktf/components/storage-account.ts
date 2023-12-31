import { Construct } from 'constructs';

import { ResourceGroup } from '../.gen/providers/azurerm/resource-group';
import { StorageAccount } from '../.gen/providers/azurerm/storage-account';
import { StorageTable } from '../.gen/providers/azurerm/storage-table';

export interface StorageAccountConstructProps {
  uniquePrefix: string;
  resourceGroup: ResourceGroup;
}

export class StorageAccountConstruct extends Construct {
  public readonly storageAccount: StorageAccount;

  constructor(scope: Construct, id: string, { uniquePrefix, resourceGroup }: StorageAccountConstructProps) {
    super(scope, id);

    this.storageAccount = new StorageAccount(this, 'StorageAccount', {
      name: `${uniquePrefix}aagamesa`,
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountTier: 'Standard',
      accountReplicationType: 'LRS',
      staticWebsite: {
        indexDocument: 'index.html',
        error404Document: '404.html',
      },
    });

    new StorageTable(this, 'markStorageTable', {
      name: 'marks',
      storageAccountName: this.storageAccount.name,
    });

    new StorageTable(this, 'userStorageTable', {
      name: 'users',
      storageAccountName: this.storageAccount.name,
    });
  }
}